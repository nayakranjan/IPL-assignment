import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ipl_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Is it installed? "
            "Did you activate the virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
